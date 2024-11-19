import React from "react"

import MarkdownIt from "markdown-it"

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

const transformToTaskList = (html: string): string => {
  // Create a DOM parser
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // Find all list items that contain checkbox markers
  const listItems = doc.querySelectorAll("li")

  listItems.forEach((li) => {
    const paragraph = li.querySelector("p")
    if (!paragraph) return

    const text = paragraph.textContent || ""
    const checkboxMatch = text.match(/^\[(x| )\]/i)

    if (checkboxMatch) {
      const content = text.replace(/^\[(x| )\]\s*/, "")
      const isChecked = checkboxMatch[1].toLowerCase() === "x"

      const label = document.createElement("label")
      const checkbox = document.createElement("input")
      checkbox.type = "checkbox"
      if (isChecked) checkbox.checked = true

      const span = document.createElement("span")
      const div = document.createElement("div")
      const newP = document.createElement("p")

      newP.textContent = content
      div.appendChild(newP)

      label.appendChild(checkbox)
      label.appendChild(span)

      li.innerHTML = ""
      li.appendChild(label)
      li.appendChild(div)

      li.setAttribute("data-checked", isChecked ? "true" : "false")
      li.setAttribute("data-type", "taskItem")

      const parentUl = li.parentElement
      if (parentUl && parentUl.tagName === "UL") {
        parentUl.setAttribute("data-type", "taskList")
      }
    }
  })

  return doc.body.innerHTML
}

export const processMarkdown = (rawContent: string): string => {
  if (!rawContent) return "<p></p>"

  // Process markdown to HTML
  const htmlContent = md.render(rawContent.replace(/\\n\\n/g, "\n\n").trim())

  // Transform to task list structure
  return transformToTaskList(htmlContent)
}

export const useMarkdownProcessor = () => {
  return React.useCallback((rawContent: string) => {
    return processMarkdown(rawContent)
  }, [])
}

export interface MarkdownProcessorOptions {
  html?: boolean
  breaks?: boolean
  linkify?: boolean
}
