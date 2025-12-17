import { useState, useEffect } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';

const App = () => {

  const [dateInput, setDateInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];

    if (selectedDate > today) {
      setError('Date of birth cannot be in the future.');
      setDateInput('');
    } else {
      setError('');
      setDateInput(selectedDate);
    }
  };

  const calculateAge = () => {
    // Reset previous state
    setResult(null);

    if (!dateInput) {
      setError('Please select a date.');
      return;
    }

    const birthDate = new Date(dateInput);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust for negative days (borrow from previous month)
    if (days < 0) {
      months--;
      // Get days in the previous month
      const prevMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonthDate.getDate();
    }

    // Adjust for negative months (borrow from previous year)
    if (months < 0) {
      years--;
      months += 12;
    }

    // Optional fun message based on age
    let funMessage = '';
    if (months === 0 && days === 0) {
      funMessage = `Happy Birthday! 🎂`;
      setShowConfetti(true);
    } else {
      funMessage = `You are ${years} years, ${months} months, and ${days} days old.`;
    }

    setResult({ years, months, days, message: funMessage });
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Show confetti for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="min-h-screen bg-purple-600 flex items-center justify-center p-4">
      {showConfetti && <Confetti width={width} height={height} />}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Age Calculator</h1>

        <div className="mb-6">
          <label htmlFor="date-input" className="block text-gray-700 font-medium mb-2">
            Enter your Date of Birth
          </label>
          <input
            type="date"
            id="date-input"
            value={dateInput}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
          />
          {error && (
            <div className="mt-2 text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        <button
          onClick={calculateAge}
          className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition cursor-pointer"
        >
          Calculate Age
        </button>

        {result && (
          <div className="mt-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-500 rounded-lg p-4 text-center text-white">
                <span className="text-3xl font-bold block">{result.years}</span>
                <p className="text-sm mt-1">Years</p>
              </div>
              <div className="bg-green-500 rounded-lg p-4 text-center text-white">
                <span className="text-3xl font-bold block">{result.months}</span>
                <p className="text-sm mt-1">Months</p>
              </div>
              <div className="bg-orange-500 rounded-lg p-4 text-center text-white">
                <span className="text-3xl font-bold block">{result.days}</span>
                <p className="text-sm mt-1">Days</p>
              </div>
            </div>
            <div className="text-center text-gray-700 font-medium bg-gray-100 rounded-lg p-4">
              {result.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App