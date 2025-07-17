import React from 'react'

const ClearScoreboard = ({setShowModal, handleClear}) => {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-center sm:text-left animate-fadeIn">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Clear Scoreboard?</h3>
                <p className="text-gray-600 mb-6">This will remove all saved scores. Are you sure?</p>
                <div className="flex sm:justify-end justify-center gap-4">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    >
                        Yes, Clear
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ClearScoreboard