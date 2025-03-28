const gradients:string[] = [
   'bg-gradient-to-r from-teal-400 to-lime-400',
   'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500',
   'bg-gradient-to-r from-gray-400 to-gray-600',
   'bg-gradient-to-r from-yellow-200 to-red-400',
   'bg-gradient-to-l from-gray-400 from-0% to-gray-500 to-100%',
   'bg-gradient-to-tl from-pink-700 from-0% to-yellow-200 to-100%',
   'bg-gradient-to-bl from-cyan-200 from-0% to-cyan-700 to-100%',
  ];

  export const getRandomGradient = () => {
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  };