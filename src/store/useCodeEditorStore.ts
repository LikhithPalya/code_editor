import {create} from 'zustand'
import {Monaco} from '@monaco-editor/react';
import { CodeEditorState } from '@/types';
import { LANGUAGE_CONFIG } from '@/app/(root)/_constants';


const getInitialState=()=>{
    // we are accessing the data stores in local storage which can only be accessed via browser api so it should be a client code 

    // if we're on the server, return default values
    if( typeof window === "undefined"){
        return {
            language:"javascript",
            fontSize:16,
            theme:"vs-dark"
        }
    }

    //accessing local storage, so if we're on the client return local storage bc it is a browser storage
    const savedLanguage = localStorage.getItem("editor-language") || "javascript"
    const savedTheme = localStorage.getItem("editor-theme") || "vs-dark"
    const savedFontSize = localStorage.getItem("editor-font-size") || 16

    return{
        language: savedLanguage,
        theme: savedTheme,
        fontSize:Number(savedFontSize), // because monaco editor wants it to be a number and not a string
    }
}
export const useCodeEditorStore = create<CodeEditorState>((set,get)=>{ //codeeditorstate is similar to defining customtypes
    
    const initialState = getInitialState();

    return {
        ...initialState,
        output:"",
        isRunning:false,
        error:null,
        editor:null,
        executionResult:null,

        getCode:()=> get().editor?.getValue() || "",
        //TODO

        setEditor: (editor:Monaco)=>{
            const savedCode = localStorage.getItem(`editor-code-${get().language}`)
            if(savedCode) editor.setValue(savedCode);
            set({editor})
        },
        setTheme: (theme:string)=>{
            localStorage.setItem("editor-theme", theme);
            set({theme});
        },
        
        setFontSize: (fontSize: number) => {
            localStorage.setItem("editor-font-size", fontSize.toString());
            set({ fontSize });
          },
      
          setLanguage: (language: string) => {
            // Save current language code before switching
            const currentCode = get().editor?.getValue();
            if (currentCode) {
              localStorage.setItem(`editor-code-${get().language}`, currentCode);
            }
      
            localStorage.setItem("editor-language", language);
      
            set({
              language,
              output: "",
              error: null,
            });
          },

    }
})