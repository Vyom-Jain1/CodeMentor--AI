const { spawn } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Docker = require("dockerode");

const docker = new Docker();

const EXECUTION_TIMEOUT = 10000; // 10 seconds
const MEMORY_LIMIT = "256m";

const languageConfigs = {
  python: {
    extension: ".py",
    image: "python:3.9-slim",
    command: ["python"],
  },
  javascript: {
    extension: ".js",
    image: "node:16-slim",
    command: ["node"],
  },
  java: {
    extension: ".java",
    image: "openjdk:11-slim",
    command: ["java"],
  },
  cpp: {
    extension: ".cpp",
    image: "gcc:latest",
    command: ["g++"],
  },
};

class CodeRunner {
  constructor() {
    this.tempDir = path.join(__dirname, "../temp");
  }

  async initialize() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error("Error creating temp directory:", error);
      throw error;
    }
  }

  async runCode(code, language, input = "", environment = "local") {
    if (environment === "docker") {
      return this.runInDocker(code, language, input);
    }
    return this.runLocally(code, language, input);
  }

  async runLocally(code, language, input) {
    const config = languageConfigs[language];
    if (!config) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const fileId = uuidv4();
    const fileName = `${fileId}${config.extension}`;
    const filePath = path.join(this.tempDir, fileName);

    try {
      // Write code to file
      await fs.writeFile(filePath, code);

      // Execute code
      const result = await this.executeProcess(
        config.command[0],
        [filePath],
        input
      );

      // Cleanup
      await fs.unlink(filePath);

      return result;
    } catch (error) {
      // Cleanup on error
      try {
        await fs.unlink(filePath);
      } catch (e) {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  async runInDocker(code, language, input) {
    const config = languageConfigs[language];
    if (!config) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const container = await docker.createContainer({
      Image: config.image,
      Cmd: [...config.command, "/code/program" + config.extension],
      HostConfig: {
        Memory: parseInt(MEMORY_LIMIT),
        MemorySwap: parseInt(MEMORY_LIMIT),
        NetworkMode: "none",
      },
      WorkingDir: "/code",
    });

    try {
      await container.start();

      // Write code to container
      const archive = await this.createTarArchive(
        code,
        "program" + config.extension
      );
      await container.putArchive(archive, { path: "/code" });

      // Execute code
      const exec = await container.exec({
        Cmd: [...config.command, "/code/program" + config.extension],
        AttachStdout: true,
        AttachStderr: true,
      });

      const output = await this.getExecOutput(exec);

      return {
        stdout: output.stdout,
        stderr: output.stderr,
        exitCode: output.exitCode,
      };
    } finally {
      // Cleanup
      await container.stop();
      await container.remove();
    }
  }

  async executeProcess(command, args, input) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args);
      let stdout = "";
      let stderr = "";

      // Handle input
      if (input) {
        process.stdin.write(input);
        process.stdin.end();
      }

      // Collect output
      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      // Handle timeout
      const timeout = setTimeout(() => {
        process.kill();
        reject(new Error("Execution timed out"));
      }, EXECUTION_TIMEOUT);

      process.on("close", (code) => {
        clearTimeout(timeout);
        resolve({
          stdout,
          stderr,
          exitCode: code,
        });
      });

      process.on("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  async createTarArchive(content, filename) {
    const tar = require("tar-stream");
    const pack = tar.pack();

    return new Promise((resolve, reject) => {
      pack.entry({ name: filename }, content, (err) => {
        if (err) reject(err);
        pack.finalize();
      });

      const chunks = [];
      pack.on("data", (chunk) => chunks.push(chunk));
      pack.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  async getExecOutput(exec) {
    return new Promise((resolve, reject) => {
      exec.start((err, stream) => {
        if (err) return reject(err);

        let stdout = "";
        let stderr = "";

        stream.on("data", (chunk) => {
          stdout += chunk.toString();
        });

        stream.on("error", (error) => {
          stderr += error.toString();
        });

        stream.on("end", () => {
          resolve({ stdout, stderr, exitCode: 0 });
        });
      });
    });
  }
}

module.exports = new CodeRunner();
