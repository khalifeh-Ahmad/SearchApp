import { useEffect, useState } from "react";

import PrevState from "./hooks/prevState";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

function App() {
  const [term, setTerm] = useState("react");
  const [list, setList] = useState([]);
  const prevTerm = PrevState(term);

  useEffect(() => {
    const searchAPI = async () => {
      const res = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          format: "json",
          origin: "*",
          list: "search",
          srsearch: term,
        },
      });
      setList(res.data.query.search);
    };

    if (!list.length && term) {
      searchAPI();
    } else if (prevTerm !== term) {
      const debouncSrch = setTimeout(() => {
        if (term) {
          searchAPI();
        }
      }, 3000);
      return () => {
        clearTimeout(debouncSrch);
      };
    }
  }, [term, list.length, prevTerm]);

  const showRes = list.map((dt, idx) => (
    <tr key={dt.pageid} style={{ border: "1px solid black" }}>
      <td>{idx}- </td>
      <td>{dt.title}</td>
      <td>
        <span dangerouslySetInnerHTML={{ __html: dt.snippet }} />
      </td>
    </tr>
  ));

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          {" "}
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Search Input"
                onChange={(e) => setTerm(e.target.value)}
                value={term}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <table style={{ border: "1px solid gray" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>{showRes}</tbody>
          </table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
