const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { clerkMiddleware, getAuth } = require("@clerk/express");

const app = express();
const PORT = process.env.PORT || 3000;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./config/firebase-service-account.json");

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(firebaseApp);

app.use(cors());
app.use(express.json());

app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "Tickly backend is running!" });
});

// Test route: only authenticated Clerk users can access this.
app.get("/api/protected", (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  return res.json({
    message: "You are authenticated!",
    userId,
  });
});

// Create a habit.
app.post("/api/habits", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { name, icon, repeat } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof icon !== "string" ||
      !icon.trim() ||
      typeof repeat !== "string" ||
      !repeat.trim()
    ) {
      return res.status(400).json({
        message: "Name, icon, and repeat are required.",
      });
    }

    const habitRef = await db
      .collection("users")
      .doc(userId)
      .collection("habits")
      .add({
        name: name.trim(),
        icon: icon.trim(),
        repeat: repeat.trim(),
        createdAt: new Date().toISOString(),
        isActive: true,
      });

    return res.status(201).json({
      message: "Habit created successfully!",
      habit: {
        id: habitRef.id,
        name: name.trim(),
        icon: icon.trim(),
        repeat: repeat.trim(),
        isActive: true,
      },
    });
  } catch (error) {
    console.error("Error creating habit:", error);

    return res.status(500).json({
      message: "Unable to create habit.",
    });
  }
});

// Retrieve the authenticated user's active habits.
app.get("/api/habits", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("habits")
      .where("isActive", "==", true)
      .get();

    const habits = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json({ habits });
  } catch (error) {
    console.error("Error fetching habits:", error);

    return res.status(500).json({
      message: "Unable to fetch habits.",
    });
  }
});

app.get("/api/habits/completions", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { date } = req.query;

    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        message: "A valid date in YYYY-MM-DD format is required.",
      });
    }

    const habitsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("habits")
      .where("isActive", "==", true)
      .get();

    const completions = await Promise.all(
      habitsSnapshot.docs.map(async (habitDoc) => {
        const completionDoc = await habitDoc.ref
          .collection("completions")
          .doc(date)
          .get();

        return {
          habitId: habitDoc.id,
          completed: completionDoc.exists
            ? completionDoc.data().completed === true
            : false,
        };
      }),
    );

    return res.json({ date, completions });
  } catch (error) {
    console.error("Error fetching habit completions:", error);

    return res.status(500).json({
      message: "Unable to fetch habit completions.",
    });
  }
});

// Update a habit's completion status for a specific date.
app.put("/api/habits/:habitId/completion", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { habitId } = req.params;
    const { date, completed } = req.body;

    if (
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      typeof completed !== "boolean"
    ) {
      return res.status(400).json({
        message: "A valid date and completed status are required.",
      });
    }

    const habitRef = db
      .collection("users")
      .doc(userId)
      .collection("habits")
      .doc(habitId);

    const habitSnapshot = await habitRef.get();

    if (!habitSnapshot.exists || habitSnapshot.data()?.isActive !== true) {
      return res.status(404).json({
        message: "Habit not found.",
      });
    }

    await habitRef.collection("completions").doc(date).set({
      completed,
      updatedAt: new Date().toISOString(),
    });

    return res.json({
      message: "Habit completion updated.",
      habitId,
      date,
      completed,
    });
  } catch (error) {
    console.error("Error updating habit completion:", error);

    return res.status(500).json({
      message: "Unable to update habit completion.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Tickly backend running on port ${PORT}`);
});
