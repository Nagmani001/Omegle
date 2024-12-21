export default function Spinner() {
  return (
    <div className='flex justify-center space-x-2 items-center bg-white h-screen dark:invert'>
      <div className="flex flex-col justify-center">
        <span className='sr-only'>Loading...</span>
        <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-8 w-8 bg-black rounded-full animate-bounce'></div>
      </div>
    </div>
  );
}
