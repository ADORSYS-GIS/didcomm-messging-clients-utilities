import { useFormik } from 'formik'
import mediationCoordination, { keylistQuery } from '../../../message-handler/src/mediation-coordination';
export const SignupForm = () => {

    const formik = useFormik({
        initialValues: {
            mediatordid: '',
            senderdid: '',

        },
        onSubmit: async values => {
            let response = await mediationCoordination(values.mediatordid, values.senderdid);
            alert("Routing did: " + response)
        },
    });
    const formik2 = useFormik({
        initialValues: {
            connectiondid: '',
            mediatordid: '',
        },
        onSubmit: async values => {
            let result = await keylistQuery(values.mediatordid, [values.connectiondid])
            alert("Keylist Query Message: " + result)
        }
    })
    return (
        <>
            <div className="p-4 mx-auto max-w-xl bg-white font-[sans-serif]">
                <h4 className="text-3xl text-gray-800 font-extrabold text-center">Create a connection</h4>
                <form onSubmit={formik.handleSubmit} className="mt-10 space-y-4">
                    <label htmlFor="mediatordid">Mediator DID</label>
                    <input
                        id="mediatordid"
                        name="mediatordid"
                        type="text"
                        className="w-full rounded-md py-3 px-4 text-gray-800 bg-gray-100 focus:bg-transparent text-sm outline-blue-500"
                        onChange={formik.handleChange}
                        value={formik.values.mediatordid}
                    />

                    <label htmlFor="senderdid">Sender DID</label>
                    <input
                        id="senderdid"
                        name="senderdid"
                        className="w-full rounded-md py-3 px-4 text-gray-800 bg-gray-100 focus:bg-transparent text-sm outline-blue-500"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.senderdid}
                    />

                    <button className="text-white bg-blue-500 hover:bg-blue-600 tracking-wide rounded-md text-sm px-4 py-3 w-full" type="submit">Submit</button>
                </form>
            </div>

            <div className="p-4 mx-auto max-w-xl bg-white font-[sans-serif]">
                <h4 className="text-3xl text-gray-800 font-extrabold text-center">Query keys in keylist</h4>
                <form onSubmit={formik.handleSubmit} className="mt-10 space-y-4">
                    <label htmlFor="mediatordid">Mediator DID</label>
                    <input
                        id="mediatordid"
                        name="mediatordid"
                        type="text"
                        className="w-full rounded-md py-3 px-4 text-gray-800 bg-gray-100 focus:bg-transparent text-sm outline-blue-500"
                        onChange={formik2.handleChange}
                        value={formik2.values.mediatordid}
                    />

                    <label htmlFor="connectiondid">Connection DID</label>
                    <input
                        id="connectiondid"
                        name="connectiondid"
                        className="w-full rounded-md py-3 px-4 text-gray-800 bg-gray-100 focus:bg-transparent text-sm outline-blue-500"
                        type="text"
                        onChange={formik2.handleChange}
                        value={formik2.values.connectiondid}
                    />

                    <button className="text-white bg-blue-500 hover:bg-blue-600 tracking-wide rounded-md text-sm px-4 py-3 w-full" type="submit">Submit</button>
                </form>
            </div>
        </>
    );

};