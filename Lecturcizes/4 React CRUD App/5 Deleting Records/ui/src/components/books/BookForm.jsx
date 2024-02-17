import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";

function AuthorForm({ book }) {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", author: "" });

  useEffect(() => {
    if (!!book?.id) {
      setFormData({
        name: book.name || "",
        author: book.author || "",
      });
    }
  }, [book]);

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    const apiCall = !!book?.id ? axios.put(`/api/books/${book.id}`, formData) : axios.post("/api/books", formData);

    apiCall
      .then(response => {
        navigate("/books", { state: { alert: { message: `Book successfully ${!!book?.id ? "updated" : "created" }.`, variant: "success" } } });
      })
      .catch(error => {
        setAlert({ message: "Failed to create author.", variant: "danger" });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      {!!alert.message &&
        <Alert
          className="text-center"
          variant={alert.variant}
          onClose={() => setAlert({ message: "", type: "" })}
          dismissible
        >
          {alert.message}
        </Alert>
      }

      <Form className="w-50" onSubmit={isSubmitting ? null : handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            placeholder="Enter title"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={formData.author}
            placeholder="Enter first name"
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mt-4">
          <Button variant="primary" type="submit" className="me-2">Save</Button>
          <Button variant="secondary" type="button" as={Link} to="/books">Cancel</Button>
        </Form.Group>
      </Form>
    </>
  );
}

export default AuthorForm;
