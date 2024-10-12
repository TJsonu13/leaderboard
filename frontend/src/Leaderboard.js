import React, { useState, useEffect } from 'react';
import { fetchUsers, claimPoints, fetchLeaderboard } from './api';
import { Container, Row, Col, Button, Dropdown, Badge, ProgressBar } from 'react-bootstrap';
import './Leaderboard.css'; // Custom styles for Leaderboard

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);

    // Fetch users on component load
    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersData = await fetchUsers();
                setUsers(usersData);
                if (usersData.length > 0) {
                    setSelectedUserId(usersData[0]._id); // Set default user
                }
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };
        getUsers();
    }, []);

    // Fetch leaderboard
    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const leaderboardData = await fetchLeaderboard();
                setLeaderboard(leaderboardData);
            } catch (error) {
                console.error('Error loading leaderboard:', error);
            }
        };
        loadLeaderboard();
    }, []);

    // Handle claiming points
    const handleClaimPoints = async () => {
        if (selectedUserId) {
            try {
                await claimPoints(selectedUserId);
                const updatedLeaderboard = await fetchLeaderboard();
                setLeaderboard(updatedLeaderboard);
            } catch (error) {
                console.error('Error claiming points:', error);
            }
        }
    };

    return (
        <Container className="leaderboard-container mt-5">
            <Row className="mb-4 text-center">
                <Col>
                    <h1>Leaderboard</h1>
                </Col>
            </Row>

            {/* User selection dropdown */}
            <Row className="mb-4">
                <Col md={{ span: 6, offset: 3 }} className="text-center">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            {selectedUserId
                                ? users.find(user => user._id === selectedUserId)?.name
                                : 'Select User'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {users.map(user => (
                                <Dropdown.Item
                                    key={user._id}
                                    onClick={() => setSelectedUserId(user._id)}
                                >
                                    {user.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button variant="success" className="mt-3" onClick={handleClaimPoints}>
                        Claim Points
                    </Button>
                </Col>
            </Row>

            {/* Leaderboard display */}
            <Row>
                <Col>
                    <h2 className="text-center">Current Leaderboard</h2>
                    <div className="leaderboard-list">
                        {leaderboard.map((user, index) => (
                            <Row key={user._id} className="leaderboard-item align-items-center">
                                <Col md={1} className="text-center">
                                    <Badge bg={index === 0 ? "warning" : "secondary"} pill>
                                        {index + 1}
                                    </Badge>
                                </Col>
                                <Col md={5}>
                                    <strong>{user.name}</strong>
                                </Col>
                                <Col md={3}>
                                    <ProgressBar
                                        now={(user.totalPoints / 100) * 100} // Assuming max 100 points
                                        label={`${user.totalPoints} pts`}
                                    />
                                </Col>
                                <Col md={3} className="text-center">
                                    <Badge bg="info">{user.totalPoints} Points</Badge>
                                </Col>
                            </Row>
                        ))}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Leaderboard;
