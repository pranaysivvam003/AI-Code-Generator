import Image from "next/image";
import Main from "./components/main";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <main>
      <div className="">
        <Main />
        <ToastContainer/>
      </div>
    </main>
  );
}
