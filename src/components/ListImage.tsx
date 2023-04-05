"use client";

import { trpc } from "../utils/trpc";
import React from "react";

import CanvasImage from './CanvasImage'

export default function ListUsers() {
  let { data: users, isLoading, isFetching } = trpc.getUsers.useQuery();
  
  if (isLoading || isFetching) {    
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 20,
      }}
    >
      {users?.map((user) => (              
          <CanvasImage
            key={user.id}
            src={`https://robohash.org/${user.id}?set=set2&size=150x150`}                       
          />                  
      ))}
    </div>
  );
}
