import '../index.css'

export default function App() {
    return (
        <>
            <div className='grid grid-cols-3 gap-4 place-content-center h-48 '>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                start Mediation
                </button>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                    forward a message
                </button>


                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                    pickup message(s)
                </button>

            </div >

        </>
    )
}