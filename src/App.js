import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  const [canRequest, setCanRequest] = useState(false);
  const [massDayTime, setMassDayTime] = useState("---");
  const [numPeople, setNumPeople] = useState("---");
  const [email, setEmail] = useState("");

  let spots = {"Saturday, May 30, 5:00PM" : {"1-2" : 0, "3-4" : 0, "5-6": 0},
               "Sunday, May 31, 7:30AM"   : {"1-2" : 5, "3-4" : 1, "5-6": 0},
               "Sunday, May 31, 11:00AM"  : {"1-2" : 5, "3-4" : 1, "5-6": 6}
              }

  function validateEmail(email) {
    // eslint-disable-next-line
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function canSubmit() {
    if (massDayTime === "---" || numPeople === "---") {
      return false;
    }
    console.log(massDayTime);
    if (spots[massDayTime][numPeople] > 0 && validateEmail(email)) {
      if (!canRequest) {
        setCanRequest(true);
      }
      
      return true;
    }
    else {
      if (canRequest) {
        setCanRequest(false);
      }

      return false;
    }
  }

  function spotsAvailable() {
    for (let k in spots[massDayTime]) {
      if (spots[massDayTime][k] > 0) {
        return true
      }
    }

    return false;
  }

  function getSpots() {
    let initString = "";

    initString += "Spots remaining for 1-2 people: " + spots[massDayTime]["1-2"] + "\n";
    initString += "Spots remaining for 3-4 people: " + spots[massDayTime]["3-4"] + "\n";
    initString += "Spots remaining for 5-6 people: " + spots[massDayTime]["5-6"] + "\n";
    initString += "\n"

    return initString;
  }

  function handleSubmit(event) {
    console.log('Num people');
    console.log(numPeople);
    console.log('Email');
    console.log(email);
  }

  return (
    <div className="App">
      <header className="App-header">
        St. Mary's of the Assumption Mass Ticket App
      </header>
      <div className="App-Body">
        <Form onSubmit={handleSubmit} className="Request-ticket">
          <Form.Group controlId="MassDayTime">
            <Form.Label>Mass Day/Time</Form.Label>
            <Form.Control as="select" onChange={e => setMassDayTime(e.target.value)}>
              <option>---</option>
              <option>Saturday, May 30, 5:00PM</option>
              <option>Sunday, May 31, 7:30AM</option>
              <option>Sunday, May 31, 11:00AM</option>
            </Form.Control>
          </Form.Group>
          { (!spotsAvailable() && massDayTime !== "---") &&
            <div>
              There are no spots remaining for this mass.
            </div>
          }
          { (spotsAvailable() && massDayTime !== "---") &&
            <div>
              <div>
                {getSpots()}
              </div>
              <Form.Group controlId="Email" size="lg">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                />
              </Form.Group>
              <Form.Group controlId="NumberPeople">
                <Form.Label>Select Number of People</Form.Label>
                <Form.Control as="select" onChange={e => setNumPeople(e.target.value)}>
                  <option>---</option>
                  <option>1-2</option>
                  <option>3-4</option>
                  <option>5-6</option>
                </Form.Control>
              </Form.Group>
            </div>
          }
          { (massDayTime !== "---" && spots[massDayTime][numPeople] <= 0 && setNumPeople !== "---") &&
            <div className="Selection-Alert">
              ***There are no spots remaining for {numPeople} people at this mass. Please select a dfferent group size or a different mass.
            </div>
          }
          { canSubmit() &&
            <Form.Group>
              <Button block size="lg" type="submit">
                Get Ticket
              </Button>
            </Form.Group>
          }
        </Form>
      </div>
    </div>
  );
}

export default App;
