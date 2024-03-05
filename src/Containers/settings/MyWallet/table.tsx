import React from 'react';

const Table = () => {
  return (
    <div className="table">
      <thead>
        <tr>
          <th>Asset Name</th>
          <th>Credit</th>
          <th>Debit</th>
          <th>Updated Balance</th>
          <th>Date/Time</th>
          <th>Transaction ID</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>3D Abstract</td>
          <td>$300.00</td>
          <td>-</td>
          <td>$1200.00</td>
          <td>21 Nov 2023, 10:13</td>
          <td>AAA123456</td>
          <td>Success</td>
        </tr>
        <tr>
          <td>3D Abstract</td>
          <td>-</td>
          <td>$300.00</td>
          <td>$1200.00</td>
          <td>21 Nov 2023, 10:13</td>
          <td>AAA123456</td>
          <td>Success</td>
        </tr>
        <tr>
          <td>3D Abstract</td>
          <td>$300.00</td>
          <td>-</td>
          <td>$1200.00</td>
          <td>21 Nov 2023, 10:13</td>
          <td>AAA123456</td>
          <td>Success</td>
        </tr>
      </tbody>
    </div>
  )
}

export default Table;
