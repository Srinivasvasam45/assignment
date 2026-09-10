import "dotenv/config";
import mongoose from "mongoose";
import Problem from "../models/Problem.js";

const problems = [
  {
    slug: "parking-lot",
    title: "Parking Lot System",
    difficulty: "medium",
    description:
      "Design a parking lot that supports multiple vehicle types (motorcycle, car, bus) and multiple floors, each with a limited number of spots of different sizes.",
    requirements: [
      "Support at least 3 vehicle types with different spot-size needs",
      "Assign the most space-efficient available spot to an incoming vehicle",
      "Track occupancy per floor and overall",
      "Compute a parking fee when a vehicle leaves, based on duration",
      "Handle the lot being full gracefully",
    ],
  },
  {
    slug: "elevator-system",
    title: "Elevator System",
    difficulty: "hard",
    description:
      "Design the control system for a bank of elevators in a building, handling both internal (inside the elevator) and external (floor call button) requests.",
    requirements: [
      "Support multiple elevators serving the same set of floors",
      "Efficiently decide which elevator responds to a new request",
      "Track direction (up/down/idle) and current floor for each elevator",
      "Handle simultaneous requests from multiple floors",
      "Explain how your design would scale to more elevators or floors",
    ],
  },
  {
    slug: "vending-machine",
    title: "Vending Machine",
    difficulty: "easy",
    description:
      "Design a vending machine that sells multiple products, accepts coins/notes, dispenses change, and tracks inventory.",
    requirements: [
      "Support product selection and stock tracking per slot",
      "Accept payment and correctly compute/dispense change",
      "Handle out-of-stock and insufficient-payment cases",
      "Model the machine's states (idle, selecting, dispensing, etc.) explicitly",
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const p of problems) {
    await Problem.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
  }
  console.log(`Seeded ${problems.length} problems.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
