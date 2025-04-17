"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <>
      <motion.div
        className="flex w-full flex-col items-center justify-center gap-8 text-center"
        initial="hidden"
        variants={containerVariants}
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h1
          className="max-w-2xl text-pretty text-4xl !leading-tight text-gray-950 md:text-6xl dark:text-white"
          variants={itemVariants}
        >
          second brain for people living{" "}
          <span className="dark:text-polar-500 text-gray-400">on mars</span>
        </motion.h1>
        <motion.p
          className="text-pretty text-sm leading-relaxed"
          variants={itemVariants}
        >
          write, plan or capture action items from connected tools in a simple
          clean interface.
        </motion.p>
        <motion.div
          className="flex flex-row items-center gap-x-4"
          variants={itemVariants}
        >
          <Button onClick={() => router.push("/signin")}>join public beta</Button>
        </motion.div>
      </motion.div>
    </>
  );
}
