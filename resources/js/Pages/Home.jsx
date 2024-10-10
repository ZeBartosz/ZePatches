import { useForm } from '@inertiajs/react';
import React from 'react';

export default function Home({ steam }) {
    console.log(steam);  // This will log the "steam" value
    const {post} = useForm({});

    function submit(e) {
        e.preventDefault();
        post("/inputGames");
    }

    return (
        <>


            <form>
                <button>Add Games
                </button></form>
            <h1>Game News:</h1>
               
        </>
    );
}
