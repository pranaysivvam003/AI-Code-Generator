import Cookies from "js-cookie";
import styles from './main.module.css'
import PreviewScreen from "./preview";
import Image from "next/image";
import * as htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';

import { useEffect } from "react";

const Sidebar = ({ code, getCodes, disCode }) => {

  async function fetchCodes() {
    const userToken = Cookies.get('userToken');
    const options = {
      headers: {
        "Authorization": userToken
      },
      method: "GET"
    };

    try {
      const response = await fetch('/api/code', options);

      if (response.ok) {
        const data = await response.json();
        getCodes([...data.codes]);
        disCode(data.codes[0].code)
      } else {
        throw new Error('Failed to fetch codes: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error fetching codes:', error);
    }
  }

  // async function codeToImage(imageCode){
  //   try {
  //     const imgUrl = await htmlToImage.toPng(imageCode)
  //     console.log('imgUrl',imgUrl)
  //     return imgUrl
  //   } catch (error) {
  //     console.error('error in converting the code',error)
  //   }
  // }

  async function codeToImage(code) {
    const tempDiv = document.createElement('body');
    tempDiv.innerHTML = code;

    try {
      const canvas = await html2canvas(tempDiv);
      const imageUrl = canvas.toDataURL();
      return imageUrl;
    } catch (error) {
      console.error('Error converting code to image:', error);
    }
  }

  useEffect(() => {
    fetchCodes()
  }, [])

  return (
    <div className="max-h-screen  overflow-auto rounded-md p-4">
      <ul className={styles.list}>
        {code.map((codev, i) => (
          <li
            key={i}
            className={styles.listItem}
            onClick={() => disCode(codev.code)}
          >
            <div>
              <div>
                {/* <PreviewScreen className='' html_code={codev.code} /> */}
                {/* <canvas> */}
                  <Image src={codeToImage(codev.code)} alt="code image" />
                {/* </canvas> */}
              </div>

            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Sidebar;


