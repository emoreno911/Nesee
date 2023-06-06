import { useState } from "react";
import Modal from "../layout/Modal";
import { 
    ComposableBundleIcon, 
    DynamicNftIcon 
} from "../icons";

const Title = ({ children }) => (
    <h5 className="font-semibold mt-3">{children}</h5>
);

const Text = ({ children }) => <p className="font-sans mb-2">{children}</p>;

const ModalInfo = () => {
    const [isShow, setIsShow] = useState(false);

    return (
        <Modal
            show={isShow}
            handleShow={setIsShow}
            activator={({ handleShow }) => (
                <button
                    className="flex items-center text-gray-100 text-md font-bold hover:text-blue-500 mr-4"
                    onClick={() => handleShow(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-7 h-7 mr-1"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                    </svg>

                    <span>Info</span>
                </button>
            )}
        >
            <div className="bg-slate-800 text-gray-100 pt-4 pb-8 px-8 rounded-md">
                <h4 className=" text-lg mb-5 font-semibold">Basic Info</h4>
                <div className="text-sm">
                    <Title>What is NESEE?</Title>
                    <Text>
                    NESEE is a tool designed to bring a new user-friendly experience to customize and interact with NFT bundles.
                    </Text>

                    <Title>What NESEE do?</Title>
                    <Text>
                        With Nesse you'll have the opportunity to create bundles
                        of NFTs in a very friendly way, for this you only have
                        to drag and drop the elements contained within your
                        wallet and group the NFTs as you see fit.
                    </Text>
                    <Text>
                        With the customizer you will be able to generate a new image
                        for your bundles using the images of the children for
                        the composition, you also have available the options to
                        rotate, move or change the size of the elements within
                        the composition as well as the reorganization of these
                        as layers.
                    </Text>

                    <Title>How?</Title>
                    <Text>
                        You will be able to mint some test NFTs by clicking the{" "}
                        <span className="font-semibold text-blue-400">
                            Mint Test Tokens
                        </span>{" "}
                        button inside you wallet page.
                    </Text>
                    <Text>
                        You can Nest and Unnest any of your NFTs using the
                        bundle editor, but in order to use the customizer you
                        have to nest the NFTs inside a{" "}
                        <span className="font-semibold text-blue-400">
                            Root Bundle Container
                        </span>
                        , you'll recognize them with this{" "}
                        <ComposableBundleIcon /> symbol after their name.
                    </Text>
                    <Text>
                        The NFTs with this other <DynamicNftIcon /> symbol are
                        dynamic NFTs, this means they'll update its image when you press
                        the{" "}
                        <span className="font-semibold text-blue-400">
                            Update Dynamic NFT
                        </span>{" "}
                        button inside the details page.
                    </Text>
                </div>
            </div>
        </Modal>
    );
};

export default ModalInfo;
