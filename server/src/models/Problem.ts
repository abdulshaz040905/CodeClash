import mongoose from "mongoose";

interface TestCase {
  input: string;
  output: string;
}

interface Problem {
  title: string;
  description: string;
  difficulty: string;
  testCases: TestCase[];
}

const problemSchema = new mongoose.Schema<Problem>({
  title: String,
  description: String,
  difficulty: String,
  testCases: [
    {
      input: String,
      output: String,
    },
  ],
});

export default mongoose.model<Problem>("Problem", problemSchema);