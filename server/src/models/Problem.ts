import mongoose from "mongoose";

interface TestCase {
  input: string;
  output: string;
}

export interface ProblemType {
  title: string;
  description: string;
  difficulty: string;
  testCases: TestCase[];
}

const problemSchema = new mongoose.Schema<ProblemType>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  testCases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
    },
  ],
});

export default mongoose.model<ProblemType>("Problem", problemSchema);