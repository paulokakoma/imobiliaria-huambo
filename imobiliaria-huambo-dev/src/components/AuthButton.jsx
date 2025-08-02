// src/components/AuthButton.jsx

'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>A carregar...</p>;
  }

  if (session) {
    // Se o utilizador estiver logado
    return (
      <div className="flex items-center gap-4">
        <p>Olá, {session.user.name}</p>
        {session.user.image && (
          <Image
            src={session.user.image}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Sair
        </button>
      </div>
    );
  }

  // Se o utilizador não estiver logado
  return (
    <button
      onClick={() => signIn('google')}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    >
      Entrar com Google
    </button>
  );
}