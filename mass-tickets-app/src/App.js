import React, { useState , useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import LoadingOverlay from 'react-loading-overlay';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  const [canRequest, setCanRequest] = useState(false);
  const [massDayTime, setMassDayTime] = useState("---");
  const [numPeople, setNumPeople] = useState("---");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [spots, setSpots] = useState(null);
  const [sortedDays, setSortedDays] = useState(null);
  const [prevTickets, setPrevTickets] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchNumTickets() {
      fetch('/getNumTickets').then(res => res.json()).then(data => {
        setSpots(data.tickets);
        setSortedDays(data.days);
      });
    }
    fetchNumTickets();
  }, []);

  useEffect(() => {
    if (submitted) {
      async function fetchPrevTickets() {
        let data = await fetch('/getPrevTickets?mass_day_time=' + massDayTime + '&email=' + email).then(res => res.json());
        setPrevTickets(data.tickets);

        if (data.tickets.length > 0) {
          handleShow();
        }
        else {
          sendNew();
        }
      }
      fetchPrevTickets();
    }

  }, [submitted]); // eslint-disable-line

  const handleShow = () => setShow(true);
  const handleClose = () => {setShow(false); setSubmitted(false);};
  const handleResend = () => {setShow(false); resend(); };
  const handleNew = () => {setShow(false); sendNew(); };

  function validateEmail(email) {
    // eslint-disable-next-line
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function canSubmit() {
    if (massDayTime === "---" || numPeople === "---") {
      return false;
    }

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

    initString += "Reservations remaining for 1-2 people: " + spots[massDayTime]["1-2"] + "\n";
    initString += "Reservations remaining for 3-4 people: " + spots[massDayTime]["3-4"] + "\n";
    initString += "Reservations remaining for 5-6 people: " + spots[massDayTime]["5-6"] + "\n";
    initString += "\n"

    return initString;
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  function sendNew() {
    console.log("New!");
    setSubmitted(false);

    setSending(true);

    async function getNewTicket() {
      let data = await fetch('/getNewTicket?mass_day_time=' + massDayTime + '&email=' + email + '&num_people=' + numPeople).then(res => res.json());
      setSending(false);

      // New screen - please check your email and spam folder, we have sent your tickets to you + open this image
      const success = data.success;
      const ticket = data.ticket;

      if (success) {
        window.open(ticket, "_blank")
      }
    }
    getNewTicket();
  }

  function resend() {
    console.log("Old!");
    setSubmitted(false);

    setSending(true);

    async function getOldTickets() {
      await fetch('/getOldTicket?mass_day_time=' + massDayTime + '&email=' + email + '&tickets=' + prevTickets).then(res => res.json());
      setSending(false);

      // New screen - please check your email and spam folder, we have re-sent your tickets to you
    }
    getOldTickets();
  }

  return (
    <LoadingOverlay
      active={submitted || sending}
      spinner
      text='Processing Request...'>

      <div className="App">
        <header className="App-header">
          St. Mary's of the Assumption Mass Reservations
        </header>
        <div className="App-Body">
          { (spots === null || sortedDays === null) &&
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          }
          { (spots !== null && sortedDays !== null) &&
            <Form className="Request-ticket">
              <Form.Group controlId="MassDayTime">
                <Form.Label>Select Mass Day/Time</Form.Label>
                <Form.Control as="select" onChange={e => setMassDayTime(e.target.value)}>
                  <option>---</option>
                  {
                    sortedDays.map((item, index) => ( 
                      <option key={index}>{item}</option> 
                    ))
                  }
                </Form.Control>
              </Form.Group>
              { (!spotsAvailable() && massDayTime !== "---") &&
                <div>
                  There are no reservations remaining for this mass.
                </div>
              }
              { (spotsAvailable() && massDayTime !== "---") &&
                <div>
                  <div>
                    {getSpots()}
                  </div>
                  <Form.Group controlId="Email" size="lg">
                    <Form.Label>Enter Email Address</Form.Label>
                    <Form.Control
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      type="email"
                    />
                  </Form.Group>
                  <Form.Group controlId="NumberPeople">
                    <Form.Label>Select Number of People in Party</Form.Label>
                    <Form.Control as="select" value={numPeople} onChange={e => setNumPeople(e.target.value)}>
                      <option>---</option>
                      <option>1-2</option>
                      <option>3-4</option>
                      <option>5-6</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              }
              { (massDayTime !== "---" && spots[massDayTime][numPeople] <= 0 && setNumPeople !== "---" && spotsAvailable()) &&
                <div className="Selection-Alert">
                  ***There are no spots remaining for {numPeople} people at this mass. Please select a dfferent group size or a different mass.
                </div>
              }
              { canSubmit() &&
                <Form.Group>
                  <Button block size="lg" type="button" onClick={handleSubmit}>
                    Make Reservation
                  </Button>
                </Form.Group>
              }
            </Form>
          }
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Already Have Reservation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            We see that you have already have a reservation for this mass.
            If you need an additional reservation, press 'Make Another Reservation'. If you need us to re-send your reservation(s),
            press Re-send.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleResend}>
              Re-send
            </Button>
            <Button variant="primary" onClick={handleNew}>
              Make Another Reservation
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </LoadingOverlay>
  );
}

export default App;
