import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-github';


const CodeViewer = ({code}) =>{

  const editorOptions = {
    tabSize: 2,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    enableBasicAutocompletion: true
  };
  
  return(
  <div>
    <AceEditor mode={'html'}
    theme='monokai'
    name='editor'
    width='98%'
    height='700px'
    value={code}
    fontSize={14}
    showGutter={false}
    setOptions={editorOptions}
    readOnly={true}
    wrapEnabled={true}
    />
  </div>
)}

export default CodeViewer