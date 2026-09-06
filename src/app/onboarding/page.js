"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const steps = [
    "Learn your rights",
    "Practice real scenarios",
    "Build confidence under pressure",
  ];

  const isLast = step === steps.length - 1;

  return (
    <div>
      <h1>Welcome</h1>
      <p>{steps[step]}</p>

      {!isLast && (
        <button onClick={() => setStep(step + 1)}>
          Next
        </button>
      )}

      {isLast && (
        <button onClick={() => router.push("/train")}>
          Start Training
        </button>
      )}
    </div>
  );
}
