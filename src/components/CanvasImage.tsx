import React, {useEffect, useRef, useState, useMemo, useCallback, TextareaHTMLAttributes} from 'react'
import styles from '@/styles/Home.module.css'

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

interface ICanvasImage {
  src: string,
  alt: string,
}

const CanvasImage = ({
  src,
  alt
} : ICanvasImage) => { 

  const [editState, SetEditState] = useState(false)
  const [image, setImage] = useState<string>(src);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [descript, setDescript] = useState("");
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    if( canvasRef.current && editState ) {
      const canvas = canvasRef.current.getContext('2d')
      canvas?.clearRect(0,0,CANVAS_WIDTH, CANVAS_WIDTH)
      if( canvas && editState && imageRef.current ) 
        canvas.drawImage(imageRef.current,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);      
    }
  }, [editState])


  useEffect(() => {
    const handleMouseClick = (event : MouseEvent) => {
      if( canvasRef.current ) {
        const bounding = canvasRef.current.getBoundingClientRect();
        mouseX.current = event.clientX - bounding.left;
        mouseY.current = event.clientY - bounding.top;
      }
    }
    
    let currenCanvas = canvasRef.current
    if( currenCanvas && editState ) { 
      currenCanvas.addEventListener("click", handleMouseClick);
    }
    return () => {
      if( currenCanvas && editState ) { 
        currenCanvas.removeEventListener("click", handleMouseClick);
      }
    }
  }, [editState])
 
  const editImage = () => {
    SetEditState(!editState)   
  }

  const saveImage = () => {
    if( canvasRef.current ) {
      const newImage = canvasRef.current.toDataURL("image/png");
      setImage(newImage)
    }
    SetEditState(!editState)
  }

  const cancelImage = () => {
    SetEditState(!editState)
  }

  const deletePixel = useCallback(() => {   
    if(editState && canvasRef.current){
      const canvas = canvasRef.current.getContext('2d')
      if( canvas ) {        
        canvas.clearRect(mouseX.current - 5, mouseY.current - 5, 10, 10)
      }
      console.log("asdsad")
    }
  }, [editState])

  const handleChange = useCallback((event : React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescript(event.target.value)    
  }, [])

const saveModal = () => {
  setShowModal(false)
  saveData()
}

const saveData = async () => {
  const response = await fetch('/api/storeJSONData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: image, description: descript })
    });
    const data = await response.json();
    console.log(data);
}

const cancelModal = () => {
  setShowModal(false)
}

  return (
    <>
      <div className='text-center'> 
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onClick={deletePixel} className={`mx-auto mt-1 mb-1 ${editState ? 'block' : 'hidden'}`} />
      <img ref={imageRef} src={image} alt={alt} className={`mx-auto mt-1 mb-1 ${editState ? 'hidden' : 'block'}`} crossOrigin="anonymous" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
      <h3>{alt}</h3>
      <div className={`mx-auto mt-1 mb-1 ${styles.sobtn}`} onClick={ editState ? saveImage : editImage}>{ editState ? "Save" : "Edit"}</div>
      <div className={`mx-auto mt-1 mb-1 ${styles.sobtn}`} onClick={ editState ? cancelImage : () => setShowModal(true)}>{ editState ? "Cancel" : "Request Edit"}</div>
    </div>
    {showModal ? (
             <>
             <div
               className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
             >
               <div className="relative w-auto my-6 mx-auto max-w-3xl">
                 {/*content*/}
                 <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                   {/*header*/}
                   <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                     <h3 className="text-3xl font-semibold text-green-600">
                       Description
                     </h3>                     
                   </div>
                   {/*body*/}
                   <div className="relative p-6 flex-auto">
                    <textarea id="w3review" className='bg-white border-solid border-black rounded border font-semibold text-green-600' name="w3review" rows={4} cols={50 } onChange={handleChange} value={descript}>                
                    </textarea>
                   </div>
                   {/*footer*/}
                   <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                     <button
                       className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                       type="button"
                       onClick={cancelModal}
                     >
                       Close
                     </button>
                     <button
                       className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                       type="button"
                       onClick={saveModal}
                     >
                       Save Changes
                     </button>
                   </div>
                 </div>
               </div>
             </div>
             <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
           </>
    ) : null}
    </>
  )
  
}

export default CanvasImage