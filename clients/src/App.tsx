// import { useFormik } from 'formik';
// import Mediation_Coordinaton from './utils/mediation';

import { mytest } from "./utils/mediation.spec";

// export default function SignupForm() {
//   // Note that we have to initialize ALL of fields with values. These
//   // could come from props, but since we don’t want to prefill this form,
//   // we just use an empty string. If we don’t do this, React will yell
//   // at us.
//   const formik = useFormik({
//     initialValues: {
//       recipient_did: '',
//       mediator_did: [''],
//       action: '',
//     },
//     onSubmit: values => {
//      Mediation_Coordinaton(values.mediator_did, values.recipient_did, values.action)
//     },
//   });
//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <label htmlFor="recipient_did">Recipient_DID</label>
//       <input
//         id="recipient_did"
//         name="recipient_did"
//         type="text"
//         onChange={formik.handleChange}
//         value={formik.values.recipient_did}
//       />

//       <label htmlFor="Mediator_did">Mediator_DID</label>
//       <input
//         id="mediator_did"
//         name="mediator_did"
//         type="text"
//         onChange={formik.handleChange}
//         value={formik.values.mediator_did}
//       />

//       <label htmlFor="action">Action</label>
//       <input
//         id="action"
//         name="action"
//         type="action"
//         onChange={formik.handleChange}
//         value={formik.values.action}
//       />

//       <button type="submit">Submit</button>
//     </form>
//   );
// };


export default function SignupForm() {
  return <h1 onClick={mytest}>Click me</h1>;
}