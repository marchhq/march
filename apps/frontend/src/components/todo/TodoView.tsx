import { AddTodo } from "./AddTodo"
import { ItemExpandModal } from "../atoms/ItemExpandModal"
import classNames from "@/src/utils/classNames"

export const TodoView = () => {
  return (
    <main className="flex h-screen flex-1 gap-8 overflow-y-auto">
      <div
        className={classNames(
          "flex size-full max-w-[800px] flex-col gap-5 text-sm"
        )}
      >
        <section className="flex flex-col gap-5">
          <AddTodo />
        </section>
      </div>
      <ItemExpandModal />
    </main>
  )
}
