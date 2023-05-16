import { useState, useEffect, useContext } from "react";
import Modal from "../layout/Modal"
import CanvasEditor from "./canvasEditor";

const ModalCustomize = () => {
    const [isShow, setIsShow] = useState(false);

	return (
		<Modal
            maxWidth="3xl"
            show={isShow}
            handleShow={setIsShow}
			activator={({ handleShow }) => (
                <button 
                    className="bg-blue-500 text-white uppercase font-bold text-sm py-3 px-6 my-3 rounded-md"
                    onClick={() => handleShow(true)}
                >
                    Customize
                </button>
            )}
		>
			<div className="bg-white text-gray-700 pt-4 pb-8 px-8 rounded-md" style={{width: "600px"}}>
				<h4 className=" text-lg mb-6 font-semibold">Customize Bundle Image</h4>
                <CanvasEditor />
			</div>
		</Modal>
	)
}

export default ModalCustomize