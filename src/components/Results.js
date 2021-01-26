import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase/app";
import { Table, Container } from "react-bootstrap";

function Results(props) {
  const id = props.location.id;
  const [result, setResult] = useState([]);
  const [test, setTest] = useState();

  const [value, loading, error] = useCollection(
    firebase.firestore().collection("Test_to").doc(id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  useEffect(() => {
    if (value) setResult(value.data().test_results);
  }, [value]);

  return (
    <Container className="col-md-6">
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td
              onClick={() => {
                setTest("set");
              }}
            >
              Beier Test
            </td>
          </tr>
        </tbody>
      </Table>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {value && test && (
        <React.Fragment key={value.id}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Fields</th>
                <th>Question Numbers</th>
                <th>Results</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Attitudes towards the past</td>
                <td>2 14 30 45 51</td>
                <td>
                  {result[1] +
                    " " +
                    result[13] +
                    " " +
                    result[29] +
                    " " +
                    result[44] +
                    " " +
                    result[50]}
                </td>
              </tr>
              <tr>
                <td>Attitudes towards the future</td>
                <td>1 20 35 41 58</td>
                <td>
                  {result[0] +
                    " " +
                    result[19] +
                    " " +
                    result[34] +
                    " " +
                    result[40] +
                    " " +
                    result[57]}
                </td>
              </tr>
              <tr>
                <td>Sense of self and attitudes towards one's own abilities</td>
                <td>10 21 31 42 61 67</td>
                <td>
                  {result[9] +
                    " " +
                    result[20] +
                    " " +
                    result[30] +
                    " " +
                    result[41] +
                    " " +
                    result[60] +
                    " " +
                    result[66]}
                </td>
              </tr>
              <tr>
                <td>Attitudes towards mother</td>
                <td>3 13 28 56 66</td>
                <td>
                  {result[2] +
                    " " +
                    result[12] +
                    " " +
                    result[27] +
                    " " +
                    result[55] +
                    " " +
                    result[65]}
                </td>
              </tr>
              <tr>
                <td>Attitudes towards father</td>
                <td>8 19 27 36 53</td>
                <td>
                  {result[7] +
                    " " +
                    result[18] +
                    " " +
                    result[26] +
                    " " +
                    result[35] +
                    " " +
                    result[52]}
                </td>
              </tr>
              <tr>
                <td>Attitudes towards home and family relationships</td>
                <td> 7 22 34 49 62</td>
                <td>
                  {result[6] +
                    " " +
                    result[21] +
                    " " +
                    result[33] +
                    " " +
                    result[48] +
                    " " +
                    result[61]}
                </td>
              </tr>
              <tr>
                <td>Attitudes towards friends</td>
                <td>15 23 32 44 63</td>
                <td>
                  {result[14] +
                    " " +
                    result[22] +
                    " " +
                    result[31] +
                    " " +
                    result[43] +
                    " " +
                    result[62]}
                </td>
              </tr>
              <tr>
                <td>Attitudes towards authority</td>
                <td>6 26 48 50 65</td>
                <td>
                  {result[5] +
                    " " +
                    result[25] +
                    " " +
                    result[47] +
                    " " +
                    result[49] +
                    " " +
                    result[64]}
                </td>
              </tr>
              <tr>
                <td>Fears and worries</td>
                <td>9 24 33 55 64</td>
                <td>
                  {result[8] +
                    " " +
                    result[23] +
                    " " +
                    result[32] +
                    " " +
                    result[54] +
                    " " +
                    result[63]}
                </td>
              </tr>
              <tr>
                <td>Attitudes towards school and work</td>
                <td>5 17 37 43 54</td>
                <td>
                  {result[4] +
                    " " +
                    result[16] +
                    " " +
                    result[36] +
                    " " +
                    result[42] +
                    " " +
                    result[53]}
                </td>
              </tr>
              <tr>
                <td>Attitudes towards school and work</td>
                <td>4 16 38 47 57</td>
                <td>
                  {result[3] +
                    " " +
                    result[15] +
                    " " +
                    result[37] +
                    " " +
                    result[46] +
                    " " +
                    result[56]}
                </td>
              </tr>
              <tr>
                <td>Attitudes toward relations with the opposite sex</td>
                <td>12 25 39 46 60</td>
                <td>
                  {result[11] +
                    " " +
                    result[24] +
                    " " +
                    result[38] +
                    " " +
                    result[45] +
                    " " +
                    result[59]}
                </td>
              </tr>
              <tr>
                <td>General attitudes</td>
                <td>11 18 29 40 52 59</td>
                <td>
                  {result[10] +
                    " " +
                    result[17] +
                    " " +
                    result[28] +
                    " " +
                    result[39] +
                    " " +
                    result[51] +
                    " " +
                    result[58]}
                </td>
              </tr>
            </tbody>
          </Table>
        </React.Fragment>
      )}
    </Container>
  );
}

export default Results;
