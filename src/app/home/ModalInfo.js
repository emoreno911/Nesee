import { useState } from "react";
import Modal from "../layout/Modal";

const Title = ({ children }) => (
    <h5 className="font-semibold mt-3">{children}</h5>
);

const Text = ({ children }) => <p className="font-sans mb-2">{children}</p>;

const ComposableBundleIcon = () => (
    <span
        className="inline-block text-teal-400 align-middle"
        title="Composable Bundle"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
            />
        </svg>
    </span>
);

const DynamicNftIcon = () => (
    <span
        className="inline-block text-red-400 align-middle"
        title="Dynamic Background"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
        </svg>
    </span>
);

const ModalInfo = () => {
    const [isShow, setIsShow] = useState(false);

    return (
        <Modal
            show={isShow}
            handleShow={setIsShow}
            activator={({ handleShow }) => (
                <button
                    className="flex items-center text-gray-100 text-md font-bold hover:text-blue-500 mb-6"
                    onClick={() => handleShow(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                    </svg>

                    <span>Basic Info</span>
                </button>
            )}
        >
            <div className="bg-slate-800 text-gray-100 pt-4 pb-8 px-8 rounded-md">
                <h4 className=" text-lg mb-5 font-semibold">Basic Info</h4>
                <div className="text-sm">
                    <Title>What is NESEE?</Title>
                    <Text>
                        NESEE is a tool designed to bring a new user-friendly experience to customize NFT bundles
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
