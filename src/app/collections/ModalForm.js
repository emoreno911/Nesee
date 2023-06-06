import { useState } from "react";
import Modal from "../layout/Modal";
import Button from "../common/Button";
import CreateCollectionForm from "./CreateCollectionForm";
import MintTokenForm from "./MintTokenForm";

const ModalForm = ({ isMintForm = false }) => {
    const [isShow, setIsShow] = useState(false);

    const buttonTitle = isMintForm ? "Mint Token" : "New Collection";
    const formTitle = isMintForm ? "Mint Token" : "New Collection";

	return (
		<Modal
            show={isShow}
            handleShow={setIsShow}
			activator={({ handleShow }) => (
                <Button onClick={() => handleShow(true)}>
                    <span className="text-md py-1 block">{buttonTitle}</span>
                </Button>
            )}
		>
			<div className="bg-slate-800 text-gray-100 pt-4 pb-8 px-8 rounded-md font-sans" style={{minWidth: "500px"}}>
				<h4 className="text-lg mb-6 font-semibold">{formTitle}</h4>
                {
                    isMintForm ? (
                        <MintTokenForm />
                    ): (
                        <CreateCollectionForm />
                    )

                }
			</div>
		</Modal>
	)
}

export default ModalForm