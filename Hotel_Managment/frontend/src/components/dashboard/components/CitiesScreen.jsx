import React from "react";

const CitiesScreen = ({
  citiesLoading,
  citiesError,
  citiesStates,
  selectedState,
  setSelectedState,
  cities,
}) => {
  return (
    <section className="space-y-8 bg-white text-black">
      <h2 className="text-4xl font-extrabold mb-8 tracking-tight">Cities</h2>

      {citiesLoading ? (
        <div className="text-center text-black">Loading...</div>
      ) : citiesError ? (
        <div className="text-center text-red-600">{citiesError}</div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-black mb-2">Select State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full max-w-xs px-4 py-2 rounded-md border border-black bg-white text-black"
            >
              {citiesStates.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-md shadow-md overflow-x-auto border border-black">
            <table className="min-w-full divide-y divide-black text-black">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Name
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black">
                {cities.map((city) => (
                  <tr
                    key={city._id}
                    className="hover:bg-black/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{city.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default CitiesScreen;
