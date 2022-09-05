import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as Plus } from '../../assets/icons/uil_plus.svg';

import Modal from '../UI/Modal';
import Alert from '../UI/Alert';
import useAxios from '../../hooks/useAxios';

import { useTodos, useAuth, useCategory } from '../../hooks/useStoreContext';

const DashboardForm = ({ onShowModal, onSetShowModal }) => {
  const { authToken } = useAuth();
  const { requestHttp, error, setError } = useAxios();
  const { categories, getAllCategory } = useCategory();
  const { addTodo, updateTodo, todoEdit, editTodo } = useTodos();

  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [deadLineInput, setDeadLineInput] = useState('');

  const [category, setCategory] = useState('');

  useEffect(() => {
    const date = new Date(todoEdit.deadline);
    if (todoEdit.id) {
      setTitleInput(todoEdit.title);
      setDescriptionInput(todoEdit.description);
      setDeadLineInput(date.toISOString().substring(0, 10));
    }
  }, [todoEdit]);

  useEffect(() => {
    requestHttp(
      {
        method: 'GET',
        url: '/categories',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      },
      (data) => {
        getAllCategory(data.data?.categories);
      }
    );
  }, [authToken, requestHttp, getAllCategory]);

  let isInputEmpty = false;

  if (titleInput && descriptionInput && deadLineInput) {
    isInputEmpty = true;
  }

  const titleChangeHandler = (event) => {
    setTitleInput(event.target.value);
  };

  const descriptionChangeHandler = (event) => {
    setDescriptionInput(event.target.value);
  };

  const deadLineChangeHandler = (event) => {
    setDeadLineInput(event.target.value);
  };

  const todoCancelHandler = () => {
    onSetShowModal(false);
    setTitleInput('');
    setDescriptionInput('');
    setDeadLineInput('');
    editTodo({});
  };

  const categoryHandler = (value) => {
    setCategory(value);
  };

  const newTodoSubmitHandler = (event) => {
    event.preventDefault();

    const date = new Date(deadLineInput).toISOString();

    if (todoEdit.id) {
      const updatedTodo = {
        id: todoEdit.id,
        title: titleInput,
        description: descriptionInput,
        deadLine: date,
        isCompleted: todoEdit.is_completed,
        categoryId: category ? category : todoEdit.categoryId,
      };

      requestHttp(
        {
          method: 'PUT',
          url: `/todos/${todoEdit.id}`,
          dataRequest: updatedTodo,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        },
        (data) => {
          console.log(data);
          updateTodo(data);
        }
      );
    } else {
      const newTodo = {
        title: titleInput,
        description: descriptionInput,
        deadline: date,
        is_completed: false,
        category_id: category,
      };

      requestHttp(
        {
          method: 'POST',
          url: '/todos',
          dataRequest: newTodo,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        },
        (data) => {
          console.log(data);
          addTodo(data);
        }
      );
    }

    onSetShowModal(false);
    setTitleInput('');
    setDescriptionInput('');
    setDeadLineInput('');
    editTodo({});
  };

  return (
    <>
      {error.isError && (
        <Alert
          className={'alert-error'}
          children={error.errorMessage}
          onError={error.isError}
          onSetError={setError}
          icons="error"
        />
      )}
      {onShowModal && (
        <Modal onCloseModalHandler={() => onSetShowModal(false)}>
          <h1 className="mb-4 font-bold">
            {todoEdit.id ? 'Edit List' : 'Create List'}
          </h1>
          <form
            onSubmit={newTodoSubmitHandler}
            className="flex flex-col gap-y-4"
          >
            <label
              htmlFor="todo-title"
              className="text-sm after:ml-1 after:text-red-500 after:content-['*']"
            >
              Title
            </label>
            <input
              required
              type="text"
              onChange={titleChangeHandler}
              value={titleInput || ''}
              placeholder="what do you want to do..."
              className="rounded bg-neutral-200 p-2 outline-none placeholder:text-sm"
            />
            <label
              htmlFor="todo-description"
              className="text-sm after:ml-1 after:text-red-500 after:content-['*']"
            >
              Todo
            </label>
            <textarea
              required
              name="todo-description"
              id="todo-description"
              cols="30"
              rows="5"
              onChange={descriptionChangeHandler}
              value={descriptionInput || ''}
              placeholder="tell me more detail about your task..."
              className="rounded bg-neutral-200 p-2 outline-none placeholder:text-sm"
            ></textarea>
            <label
              htmlFor="deadLine"
              className="text-sm after:ml-1 after:text-red-500 after:content-['*']"
            >
              Deadline
            </label>
            <input
              required
              type="date"
              onChange={deadLineChangeHandler}
              value={deadLineInput || ''}
              className="max-w-fit rounded bg-neutral-200 p-2 outline-none"
            />
            <label htmlFor="category" className="text-sm">
              Category
            </label>
            <ul className="grid max-h-40 w-full grid-cols-2 gap-2 overflow-y-auto p-2">
              {categories.map((category) => {
                // console.log(todoEdit.category_id, category.id);
                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      onFocus={() => todoEdit.category_id === category.id}
                      className={`w-full rounded bg-neutral-200 py-3 text-xs font-medium ring-1 ring-neutral-400 focus:bg-orange-10 focus:text-orange-100 focus:ring-orange-100 ${
                        todoEdit.category_id === category.id
                          ? 'bg-orange-10 text-orange-100 ring-orange-100'
                          : ''
                      }`}
                      onClick={categoryHandler.bind(this, category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                );
              })}
              <Link to={'/category'}>
                <button
                  className="flex w-full items-center justify-center gap-x-1 rounded border-2 border-dashed border-neutral-400 bg-neutral-200 py-3 text-xs"
                  type="button"
                >
                  <Plus fill="#707175" /> Add Category
                </button>
              </Link>
            </ul>
            <button
              disabled={!isInputEmpty}
              className="block cursor-pointer rounded bg-orange-100 p-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-orange-50"
            >
              {todoEdit.id ? 'Update List' : 'Create List'}
            </button>

            <button type="button" onClick={todoCancelHandler}>
              Cancel
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default DashboardForm;
