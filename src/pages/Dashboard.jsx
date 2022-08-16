import React from 'react';
import { FcTodoList } from 'react-icons/fc';

import DashboardCard from '../components/Dashboard/DashboardCard';
import DashboardForm from '../components/Dashboard/DashboardForm';
import useTodos from '../hooks/useTodos';

import todoListEmpty from '../assets/images/todo-list-empty.webp';

const Dashboard = () => {
  const { todos } = useTodos();

  const dashboardContent =
    todos.length === 0 ? (
      <div className="mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-y-3">
        <img
          src={todoListEmpty}
          alt=""
          className="max-w-[4rem] md:max-w-[6rem]"
        />
        <p className="text-center text-lg font-medium">
          Todo you add appear here
        </p>
      </div>
    ) : (
      <ul className="grid grid-cols-1 gap-y-4">
        {todos.map((todo, index) => {
          return (
            <li key={index}>
              <DashboardCard {...todo} todo={todo} />
            </li>
          );
        })}
      </ul>
    );

  return (
    <>
      <section className="flex flex-col gap-y-6 py-6">
        <div className="flex flex-row items-center justify-between">
          <h1 className="font-bold">Dashboard</h1>
          {/* <label
            className="bg-custom-white btn-sm flex cursor-pointer flex-row items-center gap-x-2 rounded-lg font-semibold shadow-material-shadow"
            htmlFor="my-modal-6"
          >
            <FcTodoList className="text-xl" />
            New +
          </label> */}
        </div>
        {dashboardContent}
      </section>
      <DashboardForm />
    </>
  );
};

export default Dashboard;
