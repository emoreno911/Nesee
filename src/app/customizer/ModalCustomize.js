import { useState } from "react";
import Modal from "../layout/Modal";
import Button from "../common/Button";
import CanvasEditor from "./canvasEditor";

const ModalCustomize = () => {
    const [isShow, setIsShow] = useState(false);

	return (
		<Modal
            maxWidth="5xl"
            show={isShow}
            handleShow={setIsShow}
			activator={({ handleShow }) => (
                <Button onClick={() => handleShow(true)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="inline w-3 h-3 mr-1"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                    </svg>

                    <span>Customizer</span>
                </Button>
            )}
		>
			<div className="bg-slate-800 text-gray-100 pt-4 pb-8 px-8 rounded-md" style={{width: "800px"}}>
				<h4 className=" text-lg mb-6 font-semibold">Customize Bundle Image</h4>
                <CanvasEditor />
			</div>
		</Modal>
	)
}

export default ModalCustomize