import _ from "lodash";
import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { TagsInput } from "react-tag-input-component";
import { FileUploader } from "react-drag-drop-files";
import { dataURItoBlob, formFieldStyle, strokeButtonStyle } from "../utils";
import { ImageIcon } from "../icons";
import { useDatacontext } from "../context";
import { createComposableCollection, uploadFile } from "../../unique/service";


function CreateCollectionForm({}) {
    const [types, setTypes] = useState(["root"]);
    const [image, setImage] = useState(null);

    const {
        data: { accounts, currentAccountIndex },
        fn: { setLoaderMessage }
    } = useDatacontext()

    const handleImageChange = (image) => {
        const reader = new FileReader();
        reader.onload = function () {
            setImage(reader.result);
        };
        reader.readAsDataURL(image);
    };

    const handleSubmit = async (values) => {
        const account = accounts[currentAccountIndex];
        const _types = types.length === 0 ? ['none'] : types;
        const elemTypes = _.uniq(['root', ..._types]); // always include root type for composable bundles

        setLoaderMessage("uploading image...")
        let ipfsCid = "Qme7wwEENK7mzBFGyQUvKVCfxxiDGyo19W2xt9bjUoo1pF"
        if (image) {
            const [blob, mime] = dataURItoBlob(image); 
            const {cid} = await uploadFile(blob);
            ipfsCid = cid;
        }

        setLoaderMessage("creating collection...")
        const data = {...values, types: elemTypes, coverIpfs: ipfsCid}
        const result = await createComposableCollection(account, data);

        if (result !== null) {
            alert(`Collection ${result} created sucessfully!`)
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        else {
            alert("An error occurred!")
        }

        setLoaderMessage(null)
    };

    const handleValidate = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = "Required";
        }
        if (values.symbol.length > 4) {
            errors.symbol = "You write more than 4 chars";
        }
        if (!values.symbol) {
            errors.symbol = "Required";
        }

        return errors;
    };

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
            <h4 className="text-sm text-gray-300">Generates a new collection with a schema compatible with the NESEE customizer</h4>
            <div className="w-full p-0 my-2">
                <Formik
                    onSubmit={handleSubmit}
                    validate={handleValidate}
                    initialValues={{ symbol: "", name: "", description: "" }}
                >
                    <Form>
                        <div className="mb-4">
                            <div className="flex">
                                <div className="w-2/3">
                                    <Field
                                        className={`${formFieldStyle} mb-2`}
                                        name="symbol"
                                        type="text"
                                        placeholder="Symbol (Max: 4 chars)"
                                    />
                                    <ErrorMessage
                                        name="symbol"
                                        render={(msg) => <Error>{msg}</Error>}
                                    />
                                    <Field
                                        className={formFieldStyle}
                                        name="name"
                                        type="text"
                                        placeholder="Name  (Max: 64 chars)"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        render={(msg) => <Error>{msg}</Error>}
                                    />
                                </div>
                                <div className="w-1/3 h-32 p-2">
                                    <ImageInput />
                                </div>
                            </div>
                            <Field
                                className={formFieldStyle}
                                name="description"
                                as="textarea"
                                rows={3}
                                placeholder="Description  (Max: 256 chars)"
                            />
                            <div className="mt-2">
                                <TagsInput
                                    value={types}
                                    onChange={setTypes}
                                    name="types"
                                    placeHolder="Enter types"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <button type="submit" className={strokeButtonStyle}>
                                <span className="text-md block py-1">
                                    Generate
                                </span>
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    );
}

export default CreateCollectionForm;
