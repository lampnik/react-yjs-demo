import React, { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';


const Editor = () => {
    const [textValue, setTextValue] = useState('A non-collaborative text app!')

    return (
        <>
            <CodeMirror
                className="editor"
                value={textValue}
                options={{
                mode: 'xml',
                    theme: 'material',
                    lineNumbers: true
                }}
                height="400px"
                onChange={(editor, data, value) => {
                    setTextValue(editor)
                }}
            />
        </>
    )
}

export default Editor;