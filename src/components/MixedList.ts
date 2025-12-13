import { Extension } from "@tiptap/core"
import type { CommandProps } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mixedList: {
      indentList: () => ReturnType
      outdentList: () => ReturnType
      convertListType: (type: "bullet" | "ordered") => ReturnType
    }
  }
}

export const MixedList = Extension.create({
  name: "mixedList",

  addCommands() {
    return {
      indentList:
        () =>
        ({ chain }: CommandProps) => {
          return chain().sinkListItem("listItem").run()
        },

      outdentList:
        () =>
        ({ chain }: CommandProps) => {
          return chain().liftListItem("listItem").run()
        },

      convertListType:
        (type: "bullet" | "ordered") =>
        ({ chain, editor }: CommandProps) => {
          // Get current list type
          const isBullet = editor.isActive("bulletList")
          const isOrdered = editor.isActive("orderedList")

          // Only convert if we're changing to a different type
          if (type === "bullet" && !isBullet) {
            return chain().toggleBulletList().run()
          } else if (type === "ordered" && !isOrdered) {
            return chain().toggleOrderedList().run()
          }
          return true
        },
    }
  },
})
