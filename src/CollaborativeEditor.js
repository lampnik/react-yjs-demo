import React, { useState, useRef, useEffect } from 'react'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import CodeMirror from '@uiw/react-codemirror';
import uniqid from 'uniqid';

let ydoc;

const CollaborativeEditor = () => {
    const [textValue, setTextValue] = useState('A collaborative text app!')
    const [joiners, setJoiners] = useState([])
    const [id, setId] = useState(null)
    const [loaded, setLoaded] = useState(false)
    

    useEffect(() => {
        ydoc = new Y.Doc(); 
    
        let provider = null;
        try {
          provider = new WebrtcProvider("generic_room_name_nicklamp", ydoc, {
            signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com', 'wss://y-webrtc-signaling-us.herokuapp.com'],
          });
    
          const awareness = provider.awareness
          const yDocument = ydoc.getMap('document')
    
          provider.on('synced', synced => {
              console.log('room new joiner: ', yDocument.toJSON())
          })
          
    
          yDocument.observeDeep(() => {    
            if (yDocument.get('textValue') !== undefined) {
              setTextValue(yDocument.get('textValue'))
            }
          })

          const myId = uniqid()
            
          awareness.setLocalStateField('user', { id: myId })
          setJoiners([
              {
                  id: myId
              }
          ])
  
          setId(myId)
          setLoaded(true)
  
          awareness.on('change', () => {
              // Map each awareness state to a dom-string
              const strings = []
              awareness.getStates().forEach(state => {
                if (state.user) {
                  strings.push(state.user)
                }
                setJoiners(strings)
              })
            })
        } catch (err) {
          console.log(err)
        }
        return () => {
          
          if (provider) {
            provider.disconnect();
            ydoc.destroy();
          }
        };
      }, []);

    return (
        <>
          {
            !loaded ?
            <></>
            :
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
                          const yDocument = ydoc.getMap('document')
                          yDocument.set('textValue', editor)
                      }}
                  />
              </>
          }
        </>
    )
}

export default CollaborativeEditor;