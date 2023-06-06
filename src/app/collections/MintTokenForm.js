import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FileUploader } from "react-drag-drop-files";
import { ImageIcon } from "../icons";
import { useDatacontext } from "../context";
import { hasNeseeSchema, getCollectionById, uploadFile, mintComposableNft } from "../../unique/service";
import { dataURItoBlob, formFieldStyle, strokeButtonStyle } from "../utils";

function MintTokenForm() {
    const [ elemTypes, setElemTypes ] = useState([]);
    const [ hasCompatibleSchema, setHasCompatibleSchema ] = useState(false);
    const [ image, setImage ] = useState(null);
    const [ imageError, setImageError ] = useState("");
    const { collectionId } = useParams(); 

    const {
        data: { accounts, currentAccountIndex },
        fn: { setLoaderMessage }
    } = useDatacontext()

    const account = accounts[currentAccountIndex];

    useEffect(() => {
        checkSchema()
    }, [collectionId])

    const checkSchema = async () => {
        const isComposable = await hasNeseeSchema(account, collectionId);
        setHasCompatibleSchema(isComposable)
        if (isComposable) {
            const collection = await getCollectionById(account, collectionId);
            const { enumValues } = collection.schema.attributesSchema[0];
            const _elemTypes = Object.keys(enumValues).map(k => enumValues[k]._) 
            setElemTypes(_elemTypes);
        }
    }

    const handleSubmit = async (values) => {
        const account = accounts[currentAccountIndex];

        setLoaderMessage("uploading image...")
        let ipfsCid = "Qme7wwEENK7mzBFGyQUvKVCfxxiDGyo19W2xt9bjUoo1pF"
        if (image) {
            const [blob, mime] = dataURItoBlob(image); 
            const {cid} = await uploadFile(blob);
            ipfsCid = cid;
        }

        setLoaderMessage("minting nft...")
        const { type, name } = values;
        const data = {name, ipfsCid, type: parseInt(type), _collectionId: collectionId}
        const result = await mintComposableNft(account, data);

        if (result !== null) {
            alert(`Token ${result} created sucessfully!`)
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        else {
            alert("An error occurred!")
        }

        setLoaderMessage(null)
    }

    const handleValidate = (values) => {
        const errors = {};

        if (image === null) {
            const err = "You should add an image to upload";
            errors.image = err;
            setImageError(err);
        }
        else {
            setImageError("")
        }

        return errors;
    };

    const handleImageChange = (image) => {
        const reader = new FileReader();
        reader.onload = function () {
            setImage(reader.result);
        };
        reader.readAsDataURL(image);
    };

    if (!hasCompatibleSchema) {
        return (
            <h4 className="text-sm text-gray-300 mb-4">Sorry, this collection isn't compatible with the Customizer</h4>
        )
    }

    const Error = ({ children }) => (
        <div className="text-xs text-red-400 py-1 px-2">{children}</div>
    );

    const ImageInput = () => (
        <FileUploader
            value={image}
            handleChange={handleImageChange}
            name="image"
            multiple={false}
            types={["JPG", "JPEG", "PNG", "GIF"]}
        >
            <div className="cursor-pointer mt-1">
                {image ? (
                    <div className="img-prev" style={{backgroundImage: `url(${image})`}}></div>
                ) : (
                    <div className="upload-field py-5 flex flex-col items-center justify-center text-center rounded-md">
                        <ImageIcon />
                        <p className="text-sm font-semibold text-gray-300">
                            Upload or drop an img right here
                        </p>
                    </div>
                )}
            </div>
        </FileUploader>
    )

    return (
        <>
            <h4 className="text-sm text-gray-300">Mint an NFT if the collection is compatible with the Customizer</h4>
            <div className="w-full p-0 my-2">
            <Formik
                    onSubmit={handleSubmit}
                    validate={handleValidate}
                    initialValues={{ type: 0, name: ""}}
                >
                    <Form>
                        <div className="mb-4">
                            <div className="flex">
                                <div className="w-2/3">
                                    <Field
                                        name="type"
                                        as="select"
                                        className={formFieldStyle}
                                    >
                                        {
                                            elemTypes.map((_type, index) => (
                                                <option key={_type} value={index}>
                                                    {_type}
                                                </option>
                                            ))
                                        }
                                    </Field>
                                    <Field
                                        className={formFieldStyle}
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                    />
                                    <Error>{imageError}</Error>
                                </div>
                                <div className="w-1/3 h-32 p-2">
                                    <ImageInput />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <button type="submit" className={strokeButtonStyle}>
                                <span className="text-md block py-1">
                                    Mint
                                </span>
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>

        </>
    );
}

export default MintTokenForm;
