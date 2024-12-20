
import { useFormik } from 'formik';

export default function RoutingForm() {
  // Pass the useFormik() hook initial form values and a submit function that will
  // be called when the form is submitted
  const formik = useFormik({
    initialValues: {
      mediatordid: '',
      message: '',
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className="p-4 mx-auto max-w-xl bg-white font-[sans-serif]">
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Mediator DID</label>
        <input
          id="mediatordid"
          name="mediatordid"
          type="mediatordid"
          className='w-full rounded-md py-3 px-4 text-gray-800 bg-gray-100 focus:bg-transparent text-sm outline-blue-500'
          onChange={formik.handleChange}
          value={formik.values.mediatordid}
        />
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="6"
          className='w-full rounded-md px-4 text-gray-800 bg-gray-100 focus:bg-transparent text-sm pt-3 outline-blue-500'
          onChange={formik.handleChange}
          value={formik.values.message}
        />

        <button className="text-white bg-blue-500 hover:bg-blue-600 tracking-wide rounded-md text-sm px-4 py-3 w-full" type="submit">Submit</button>
      </form>
    </div>
  );
};

