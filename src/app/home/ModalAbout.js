import { useState } from "react";
import Modal from "../layout/Modal";

const ModalAbout = () => {
    const [isShow, setIsShow] = useState(false);

    return (
        <Modal
            show={isShow}
            handleShow={setIsShow}
            activator={({ handleShow }) => (
                <button
                    className="bg-blue-500 text-white uppercase font-bold text-sm py-3 px-6 my-3 rounded-md"
                    onClick={() => handleShow(true)}
                >
                    About NESEE
                </button>
            )}
        >
            <div className="bg-white text-gray-700 pt-4 pb-8 px-8 rounded-md">
                <h4 className=" text-lg mb-6 font-semibold">About NESEE</h4>
                <div className="text-sm">
                    <h5 className="font-semibold mt-5">What is NESEE?</h5>
                    <p>
                        NESEE is a tool designed to enjoy the experience of
                        customized NFT's
                    </p>

                    <h5 className="font-semibold mt-5">Who are we?</h5>
                    <p>
                        We're a small and dynamic team who likes to make cool
                        things for Web2 and Web3. Miss Brightside is the
                        Marketing Strategist, she uses the power of the
                        lightning to put together awesome investigations and
                        content. Her cat thinks she's a God. Mr. Robot is the
                        Software Developer, he codes stunning and usable
                        webapps. He trades to make life changing money but has
                        to code to survive his trading. Together they bring
                        projects to life
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default ModalAbout;
