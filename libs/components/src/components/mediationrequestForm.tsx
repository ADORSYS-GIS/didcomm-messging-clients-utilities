import { useFormik } from 'formik'
import mediationCoordination from '../../../message-handler/src/mediation-coordination';
export const SignupForm = () => {

    const formik = useFormik({
        initialValues: {
            mediatordid: '',
            senderdid: '',

        },
        onSubmit: values => {
            mediationCoordination(values.mediatordid, values.senderdid)
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="mediatordid">Mediator DID</label>
            <input
                id="mediatordid"
                name="mediatordid"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.mediatordid}
            />

            <label htmlFor="senderdid">Sender DID</label>
            <input
                id="senderdid"
                name="senderdid"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.senderdid}
            />

            <button type="submit">Submit</button>
        </form>
    );
};