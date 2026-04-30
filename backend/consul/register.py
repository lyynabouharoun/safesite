import consul
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def register_services():
    consul_host = 'consul'
    consul_port = 8500
    
    try:
        c = consul.Consul(host=consul_host, port=consul_port)
        logger.info(f"Connected to Consul at {consul_host}:{consul_port}")
    except Exception as e:
        logger.error(f"Failed to connect to Consul: {e}")
        return

    # First, deregister all existing services
    services = c.agent.services()
    for service_id in services.keys():
        
        c.agent.service.deregister(service_id)
        logger.info(f"🗑️ Deregistered {service_id}")

    # Define services with health checks
    services_with_health = [
        ("backend", 8000, "/health"),
        ("auth-service", 8002, "/health"),
        ("ai-service", 8001, "/health"),
    ]
    
    # Register services with health checks
    for name, port, health_endpoint in services_with_health:
        try:
            check = consul.Check.http(
                f"http://{name}:{port}{health_endpoint}",
                interval="10s",
                timeout="5s"
            )
            c.agent.service.register(
                name=name,
                service_id=f"{name}-1",
                address=name,
                port=port,
                tags=["api"],
                check=check
            )
            logger.info(f"✅ Registered {name} with health check on port {port}")
        except Exception as e:
            logger.error(f"❌ Failed to register {name}: {e}")

    # Register services WITHOUT health checks
    services_no_health = [
        ("frontend", 5173, ["react", "ui"]),
        ("rabbitmq", 15672, ["queue"]),
        ("redis", 6379, ["cache"]),
    ]
    
    for name, port, tags in services_no_health:
        try:
            c.agent.service.register(
                name=name,
                service_id=f"{name}-1",
                address=name,
                port=port,
                tags=tags
            )
            logger.info(f"✅ Registered {name} (no health check) on port {port}")
        except Exception as e:
            logger.error(f"❌ Failed to register {name}: {e}")

    # List all registered services
    logger.info("\n" + "="*50)
    logger.info("REGISTERED SERVICES:")
    logger.info("="*50)
    
    services_list = c.agent.services()
    for service_id, service_info in services_list.items():
        has_check = 'check' in service_info
        status = "✅" if has_check else "⚪"
        logger.info(f"  {status} {service_info['Service']}: {service_info['Address']}:{service_info['Port']}")

if __name__ == "__main__":
    register_services()