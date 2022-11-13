import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    startService();
  }, []);

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  const handleClick = async () => {
    // If there is no ref.current then exit
    if (!ref.current) {
      return;
    }

    // Otherwise, run the code
    // transform === transpile in the world of esbuild
    // const result = await ref.current.transform(input, {
    //   loader: 'jsx', // This is the default loader
    //   target: 'es2015', // This is the default target
    // });

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });

    // console.log(result);

    // Set the code to the result
    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <h1>Transpile the JSX code right into the browser 🚀</h1>
      <textarea
        placeholder='Write some JSX and see the magic 🪄'
        rows={10}
        cols={50}
        value={input}
        title='Type Here'
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={handleClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
