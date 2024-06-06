package server

func (s *FiberServer) RegisterFiberRoutes() {
	order := s.App.Group("/orders")
	{
		order.Post("/set", s.handler.Order.CreateOrder)
	}
}
