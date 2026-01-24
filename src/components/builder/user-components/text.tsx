"use client"

import React from "react"
import { useNode } from "@craftjs/core"
import ContentEditable from "react-contenteditable"

interface TextProps {
    text: string
    fontSize?: string
    textAlign?: string
    color?: string
}

export const Text = ({ text, fontSize = "text-base", textAlign = "text-left", color = "text-inherit" }: TextProps) => {
    const { connectors: { connect, drag }, actions: { setProp } } = useNode()

    return (
        <div ref={(ref) => connect(drag(ref as HTMLElement))} className={`${fontSize} ${textAlign} ${color}`}>
            <ContentEditable
                html={text}
                disabled={false}
                onChange={(e) => setProp((props: any) => (props.text = e.target.value), 500)}
                tagName="span"
                className="outline-none focus:bg-blue-100/20"
            />
        </div>
    )
}

Text.craft = {
    displayName: "Text",
    props: {
        text: "Edit me!",
        fontSize: "text-base",
        textAlign: "text-left",
        color: "text-slate-900 dark:text-slate-100",
    },
}
