"use client"
import * as React from "react"

import { ArrowLeft, ArrowRight, MoonStars } from "@phosphor-icons/react"
import { getDate } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

// import Editor from "./atoms/Editor"
import Button from "@/src/components/atoms/Button"
import { getOrdinalSuffix, getMonthName, getDayPhase } from "@/src/utils/datetime"

interface Props {
  dateChangeCounter: number
  currentDate: Date
  prevDay: () => void
  nextDay: () => void
}

const DayTasks: React.FC<Props> = ({
  dateChangeCounter,
  currentDate,
  prevDay,
  nextDay,
}) => {
  // const [content, setContent] = React.useState(`<ul data-type="taskList">
  //         <li data-type="taskItem" data-checked="false">Today Page</li>
  //         <li data-type="taskItem" data-checked="false">Inbox Page</li>
  //         <li data-type="taskItem" data-checked="false">Notes Page</li>
  //         <li data-type="taskItem" data-checked="false">Sidebar</li>
  //         <li data-type="taskItem" data-checked="true">Clerk Auth</li>
  //         <li data-type="taskItem" data-checked="true">SEO Changes</li>
  //         <li data-type="taskItem" data-checked="true">Repo Setup</li>
  //       </ul>`)

  const now = React.useMemo(() => getDayPhase(), [])

  return (
    <section className="h-full rounded-lg border border-white/10 bg-white/10 px-6 py-5 shadow-lg backdrop-blur-lg">
      <h1 className="mb-6 flex items-center gap-1.5 text-base font-normal leading-none text-zinc-500">
        <MoonStars size={16} />
        <span>Good {now}</span>
      </h1>
      <div className="mb-10 flex items-center justify-between">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            initial={{ opacity: 0, translateX: 10 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: -10 }}
            key={dateChangeCounter}
          >
            <div className="flex items-end gap-2">
              <p className="text-4xl text-zinc-300">
                {getDate(currentDate)}
                {getOrdinalSuffix(getDate(currentDate))}
              </p>
              <p className="text-zinc-500">{getMonthName(currentDate)}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-1 text-zinc-400">
          <Button
            size={"icon"}
            variant={"invisible"}
            onClick={() => {
              prevDay()
            }}
            className="group rounded-full p-2 transition-colors hover:bg-zinc-700"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-active:-translate-x-1"
              weight="duotone"
            />
          </Button>
          <Button
            size={"icon"}
            variant={"invisible"}
            onClick={() => {
              nextDay()
            }}
            className="group rounded-full p-2 transition-colors hover:bg-zinc-700"
          >
            <ArrowRight
              size={18}
              className="transition-transform group-active:translate-x-1"
              weight="duotone"
            />
          </Button>
        </div>
      </div>
      {/* <Editor content={content} setContent={setContent} /> */}
    </section>
  )
}

export default DayTasks
