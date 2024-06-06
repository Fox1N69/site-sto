package server

func (s *FiberServer) RegisterFiberRoutes() {
	order := s.App.Group("/orders")
	{
		order.Post("/set", s.handler.Order.CreateOrder)
	}

	user := s.App.Group("/users")
	{
		user.Post("/register", s.handler.User.Register)
	}
}
